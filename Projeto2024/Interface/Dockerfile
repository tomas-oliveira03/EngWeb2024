FROM node

WORKDIR /app

COPY . .
RUN npm install

RUN apt-get update && \
    apt-get install -y python3 python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip3 install --no-cache-dir lxml requests

EXPOSE 3001

CMD npm start