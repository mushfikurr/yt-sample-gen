# yt-sample-gen
`yt-sample-gen` is a web application allowing users to generate 10-second audio clips from random YouTube videos.

This was developed with music producers in mind, who are always searching for new and interesting sounds to use in their production.

#### Features
- Download/listen to samples being generated.
- Allow custom words to refine the sounds being searched for.
- Intuitive interface to simplify the searching process.

#### Planned features
- [ ] Download all samples generated to a .zip file.
- [ ] More parameters to refine search:
	- Choose from more fractional lengths of video.
	- Use more search results in a generation (currently only the first search result unless there is a conflict of phrases).
- [ ] Allow for "sticky" phrases (append chosen words to all phrases).
- [ ] General speed up of service.
- [ ] Allow for cancelling tasks before completion.

### Hosting locally for development
Clone repository to a directory. Inside the directories, there are both `frontend` and `backend` folders.

#### Backend (Python: Flask, Celery)
- Ensure you have [poetry](https://python-poetry.org/docs/#installing-with-pipx) installed on your machine.
- Using the terminal, navigate to the backend directory (`cd yt-sample-gen/backend`).
- Run `poetry install`. This should install all dependencies required.

You will need some sort of message broker. For this project, I have decided to go with [Redis](https://redis.io/). The free tier of [Redis Cloud](https://redis.com/cloud/overview/) should suffice for most personal use.

**For Redis:**
- Locate your connection address. It should look something like this `redis://:password@hostname:port/db_number`. If you are running the free tier, you can only use `0` for `db_number` as you only have access to one database. You can also configure other secure ways of connecting using the [Celery documentation](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html).

**Running the backend:** You will require two terminals for this, one to run the Flask server and one to run the Celery worker. *In the future, I will explore ways to set up a concurrent way of running these together.*
- In the **first terminal**, run `poetry shell` to enter the interactive poetry shell.
- Start the Flask server using `flask run`. You can add `--debug` to allow hot-reloading for the Flask server.
- In the **second terminal**, run `poetry shell` to enter the interactive poetry shell.
	- **For Windows:** Start the Celery worker using `poetry run celery -A make_celery worker --loglevel INFO -P gevent`. (NOTE: Cancelling tasks using the `SIGKILL` signal does not work. Additionally, Celery does not support Windows anymore, but seems to work as intended regardless). 
	- **For Linux-based systems:** Start the Celery worker using `poetry run celery -A make_celery worker --loglevel INFO`.

With these two terminals, you should be able to receive HTTP requests. All the endpoints can be found in `backend/routes.py`.

#### Frontend (Vite: React)
- Ensure you have [node](https://nodejs.org/en/download/current) installed on your machine.
- Ideally, you should have set up the backend section first, and have the two terminals running. We now need another terminal to run the frontend.
- Using the terminal, navigate to the frontend directory (`cd yt-sample-gen/frontend`).
- Run `npm i` to install the dependencies.

**Running the frontend:** You will require a third terminal (following from setting up the backend).
- Run the Vite server by entering `npm run dev`. To add extra arguments for Vite, locate the package.json in the `frontend/` folder and adjust the `dev` script.

##### Extra notes:
Thanks to [@ColugoMusic](https://x.com/ColugoMusic/status/1726001266180956440?s=20) for the inspiration.




