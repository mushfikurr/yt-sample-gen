from pydub import AudioSegment, effects
from celery.contrib.abortable import AbortableTask

from yt_dlp import YoutubeDL
import glob
import os
import random
from collections import defaultdict
import traceback
from celery import shared_task
import shutil

BATCH_SIZE            = 24 # Batch size for user-generated word list samples
DEFAULT_BATCH_SIZE    = 32 # Batch size for generating already generated samples
MAX_SEARCH_RESULTS    = 9
OUTPUT_FORMAT         = 'wav'
DOWNLOAD_DIR          = f'{OUTPUT_FORMAT}s/raw'
LOOP_OUTPUT_DIR       = f'{OUTPUT_FORMAT}s/processed/loop'
ONESHOT_OUTPUT_DIR    = f'{OUTPUT_FORMAT}s/processed/oneshot'
WORD_LIST             = 'words.txt'
DEFAULT_DIRECTORY     = 'default'

def get_dir_with_id(dir, id):
  return os.path.join(dir, id);

def read_lines(file):
  return open(file).read().splitlines()

class download_range_func:
  def __init__(self):
    pass

  def __call__(self, info_dict, ydl):
    timestamp = self.make_timestamp(info_dict)
    yield {
        'start_time': timestamp,
        'end_time': timestamp,
    }
  
  @staticmethod
  def make_timestamp(info):
      duration = info['duration']
      if duration is None:
        return 0
      return duration/2

class CustomLogger(object):
  def debug(self, msg):
      # Ignore debug output unless needed
      pass

  def warning(self, msg):
      # Ignore warning output unless needed
      pass

  def error(self, msg):
      print("[yt-dl]", msg)

def status_hook(d):
  if d['status'] == 'downloading':
      print('[yt-dl] Downloading ...', d['filename'])
  if d['status'] == 'error':
      print('[yt-dl] ERROR', d['filename'])
  if d['status'] == 'finished':
      print('[yt-dl] Done downloading, now converting', d['filename'])

def make_download_options(id):
  return {
    'format': 'bestaudio/best',
    'paths': {'home': get_dir_with_id(DOWNLOAD_DIR, id)},
    'outtmpl': {'default': '%(id)s.%(ext)s'},
    'download_ranges': download_range_func(),
    'verbose': True,
    'ignoreerrors': True,
    'quiet': True,
    'noprogress': True,
    'maxdownloads': 5,
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': OUTPUT_FORMAT,
    }],
    'logger': CustomLogger(),
    'progress_hooks': [status_hook],
  }

def make_oneshot(sound, output_filepath):
  final_length = min(2000, len(sound))
  quarter = int(final_length/4)
  sound   = sound[:final_length]
  sound   = sound.fade_out(duration=quarter)
  sound   = effects.normalize(sound)
  sound.export(output_filepath, format=OUTPUT_FORMAT)

def make_loop(sound, output_filepath):
  final_length = min(2000, len(sound))
  half         = int(final_length/2)
  fade_length  = int(final_length/3)
  beg   = sound[:half]
  end   = sound[half:]
  end   = end[:fade_length]
  beg   = beg.fade_in(duration=fade_length)
  end   = end.fade_out(duration=fade_length)
  sound = beg.overlay(end)
  sound = effects.normalize(sound)
  sound.export(output_filepath, format=OUTPUT_FORMAT)

def process_file(filepath, id):
  try:
    filename                = os.path.basename(filepath)
    output_filepath_oneshot = os.path.join(get_dir_with_id(ONESHOT_OUTPUT_DIR, id), 'oneshot_' + filename)
    output_filepath_loop    = os.path.join(get_dir_with_id(LOOP_OUTPUT_DIR, id), 'loop_' + filename)
    sound                   = AudioSegment.from_file(filepath, OUTPUT_FORMAT)
    if (len(sound) > 500):
      if not os.path.exists(output_filepath_oneshot):
        make_oneshot(sound, output_filepath_oneshot)
      if not os.path.exists(output_filepath_loop):
        make_loop(sound, output_filepath_loop)
    os.remove(filepath)
    print("processed and removed temp file '{}'".format(filepath))
    return filename
  except Exception as err:
    print("failed to process '{}' ({})".format(filepath, err))

def setup_dirs(id):
  LOOP_ID_DIR = get_dir_with_id(LOOP_OUTPUT_DIR, id)
  ONESHOT_ID_DIR = get_dir_with_id(ONESHOT_OUTPUT_DIR, id)
  if not os.path.exists(LOOP_ID_DIR):
    os.makedirs(LOOP_ID_DIR)
  if not os.path.exists(ONESHOT_ID_DIR):
    os.makedirs(ONESHOT_ID_DIR)
  
  if os.path.exists(LOOP_ID_DIR):
    files = glob.glob(os.path.join(LOOP_ID_DIR, f"*.{OUTPUT_FORMAT}"))
    if (files):
      for f in files:
        os.remove(f)
      print("cleared loop files for", id, "".join(files))

  if os.path.exists(ONESHOT_ID_DIR):
    files = glob.glob(os.path.join(ONESHOT_ID_DIR, f"*.{OUTPUT_FORMAT}"))
    if (files):
      for f in files:
        os.remove(f)
      print("cleared loop files for", id, "".join(files))

def make_random_search_phrase(word_list):
  words = random.sample(word_list, 2)
  phrase = ' '.join(words)
  print('Search phrase: "{}"'.format(phrase))
  return phrase

def start_yt_dl(id: str, searched_phrases: [str], phrase) -> str:
  video_url = 'ytsearch1:"{}"'.format(phrase)
  conflicts = defaultdict(list)

  if phrase in searched_phrases:
    new_webpage_url = handle_conflicting_phrase(phrase, conflicts)
            
    if new_webpage_url:
      print("the conflicts now look like {}".format(conflicts))
      video_url = new_webpage_url
            
  YoutubeDL(make_download_options(id)).download([video_url])
  return phrase

# Handle any duplicate phrases.
# If there any duplicate phrases, instead of using the first search result,
# we can look for alternatives.
# This is useful for when we do not have a lot of words to work with (and duplicate word combinations are high)
def handle_conflicting_phrase(phrase: str, conflicts: defaultdict[str, list]) -> str or None:
  MAX_SEARCH_RESULTS_FOR_CONFLICTS = 5 # TODO: Make this dynamic based on amount of words

  print("> {} was already searched for, modifying url".format(phrase))
  try:
    search_results = YoutubeDL({'logger': CustomLogger()}).extract_info(
      url=f"ytsearch{MAX_SEARCH_RESULTS_FOR_CONFLICTS}:{phrase}",
      download=False
    )

    entries = search_results.get("entries")
    search_result_index = random.choice([i for i in range(0,len(entries)) if i not in conflicts[phrase]]) 

    entry = entries[search_result_index]
    webpage_url = entry.get("webpage_url")

    print("new url: {} (search result index: {})".format(webpage_url, search_result_index))
    if entry:
      conflicts[phrase].append(search_result_index)
      return webpage_url
    else:
      print("was not able to find alternative video. overwriting older file for {}".format(phrase))
      return None
  except Exception:
     print("HANDLE CONFLICT ERROR: {}".format(traceback.format_exc()))
     return None

def init_random_files():
  files_in_loop_directory = glob.glob(os.path.join(get_dir_with_id(LOOP_OUTPUT_DIR, "default"), f"*.{OUTPUT_FORMAT}"))
  print("loaded files {}".format(files_in_loop_directory))
  random_files = random.sample(files_in_loop_directory, DEFAULT_BATCH_SIZE)
  print("> returning directories from", get_dir_with_id(LOOP_OUTPUT_DIR, "default"))
  return [os.path.basename(i)[5:] for i in random_files]

def cleanup(id):
  DOWNLOAD_PATH = get_dir_with_id(DOWNLOAD_DIR, id)
  LOOP_PATH = get_dir_with_id(LOOP_OUTPUT_DIR, id)
  ONESHOT_PATH = get_dir_with_id(ONESHOT_OUTPUT_DIR, id)

  try:
    print("removing temp download path...")
    shutil.rmtree(DOWNLOAD_PATH)
    print("removing loop path...")
    shutil.rmtree(LOOP_PATH)
    print("removing oneshot path...")
    shutil.rmtree(ONESHOT_PATH)
  except Exception as e:
    print(f"failed to execute cleanup for task {id}: {e}")

@shared_task(ignore_result=False, bind=True, base=AbortableTask)
def init(self, id, word_list):
  try:
    setup_dirs(id)
    print("> loaded words list {}".format(", ".join(word_list)))
    processed_files = []
    searched_phrases = []

    for i in range(BATCH_SIZE):
        print(f"Iteration {i} for {id}")
        print("aborted?", self.is_aborted())

        phrase = make_random_search_phrase(word_list)
        self.update_state(state='PROGRESS',
                          meta={'current': phrase,
                                'total': BATCH_SIZE,
                                'status': "Downloading file"})
        phrase = start_yt_dl(id, searched_phrases, phrase)

        for filepath in glob.glob(os.path.join(get_dir_with_id(DOWNLOAD_DIR, id), f'*.{OUTPUT_FORMAT}')):
          if os.path.basename(filepath) not in processed_files:
            self.update_state(state='PROGRESS',
                              meta={'current': phrase,
                                    'total': BATCH_SIZE,
                                    'status': "Processing file"})
            processed_file_name = process_file(filepath, id)
            if processed_file_name:
                processed_files.append(processed_file_name)
                searched_phrases.append(phrase)

        
    print("> processed files ", processed_files)
    return processed_files
  except Exception:
    print("FATAL ERROR {}".format(traceback.format_exc()))
    self.update_state(state='FAILURE',
                      meta='internal server error. check logs')
    return []
  finally:
    print(f"cleaning up task {id}...")
    cleanup(id)
      


    
