from pydub import AudioSegment, effects
from yt_dlp import YoutubeDL
import glob
import isodate
import os
import random
import subprocess
import wave

BATCH_SIZE         = 32
MAX_SEARCH_RESULTS = 10
DOWNLOAD_DIR         = 'wavs/raw'
LOOP_OUTPUT_DIR      = 'wavs/processed/loop'
ONESHOT_OUTPUT_DIR   = 'wavs/processed/oneshot'
WORD_LIST            = 'words.txt'

def get_dir_with_id(dir, id):
  return dir + "/" + id;

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

def make_random_search_phrase(word_list):
  words = random.sample(word_list, 2)
  phrase = ' '.join(words)
  print('Search phrase: "{}"'.format(phrase))
  return phrase

def make_download_options(id):
  return {
    'format': 'bestaudio/best',
    'paths': {'home': get_dir_with_id(DOWNLOAD_DIR, id)},
    'outtmpl': {'default': '%(id)s.%(ext)s'},
    'download_ranges': download_range_func(),
    'verbose': True,
    'ignoreerrors': True,
    'maxdownloads': 5,
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'wav',
    }]
  }

def make_oneshot(sound, output_filepath):
  final_length = min(2000, len(sound))
  quarter = int(final_length/4)
  sound   = sound[:final_length]
  sound   = sound.fade_out(duration=quarter)
  sound   = effects.normalize(sound)
  sound.export(output_filepath, format="wav")

def make_loop(sound, output_filepath):
    final_length = min(2000, len(sound))
    half         = int(final_length/2)
    fade_length  = int(final_length/4)
    beg   = sound[:half]
    end   = sound[half:]
    end   = end[:fade_length]
    beg   = beg.fade_in(duration=fade_length)
    end   = end.fade_out(duration=fade_length)
    sound = beg.overlay(end)
    sound = effects.normalize(sound)
    sound.export(output_filepath, format="wav")

def process_file(filepath, id):
  try:
    filename                = os.path.basename(filepath)
    output_filepath_oneshot = os.path.join(get_dir_with_id(ONESHOT_OUTPUT_DIR, id), 'oneshot_' + filename)
    output_filepath_loop    = os.path.join(get_dir_with_id(LOOP_OUTPUT_DIR, id), 'loop_' + filename)
    sound                   = AudioSegment.from_file(filepath, "wav")
    if (len(sound) > 500):
      if not os.path.exists(output_filepath_oneshot):
        make_oneshot(sound, output_filepath_oneshot)
      if not os.path.exists(output_filepath_loop):
        make_loop(sound, output_filepath_loop)
    os.remove(filepath)
    return filename
  except Exception as err:
    print("Failed to process '{}' ({})".format(filepath, err))

def setup_dirs(id):
    if not os.path.exists(get_dir_with_id(LOOP_OUTPUT_DIR, id)):
      os.makedirs(get_dir_with_id(LOOP_OUTPUT_DIR, id))
    if not os.path.exists(get_dir_with_id(ONESHOT_OUTPUT_DIR, id)):
      os.makedirs(get_dir_with_id(ONESHOT_OUTPUT_DIR, id))

def init(id):
  try:
    setup_dirs(id)
    word_list = read_lines(WORD_LIST)
    completed_files = []
    for _ in range(BATCH_SIZE):
      phrase    = make_random_search_phrase(word_list)
      video_url = 'ytsearch1:"{}"'.format(phrase)
      YoutubeDL(make_download_options(id)).download([video_url])
      for filepath in glob.glob(os.path.join(get_dir_with_id(DOWNLOAD_DIR, id), '*.wav')):
        processed_file_name = process_file(filepath, id)
        if (processed_file_name):
          completed_files.append(processed_file_name)
    return completed_files
  except Exception as err:
     print('FATAL ERROR: {}'.format(err))