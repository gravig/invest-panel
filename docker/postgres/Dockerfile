FROM postgres:15

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    build-essential \
    postgresql-server-dev-15 \
    git \
    ca-certificates \
  && git clone --branch v0.8.0 --depth 1 https://github.com/pgvector/pgvector.git /tmp/pgvector \
  && cd /tmp/pgvector \
  && make OPTFLAGS="" \
  && make OPTFLAGS="" install \
  && cd / \
  && rm -rf /tmp/pgvector \
  && apt-get remove -y build-essential postgresql-server-dev-15 git \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*
