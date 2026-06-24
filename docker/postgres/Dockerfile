FROM postgres:15 AS pgvector-builder

ARG PG_VERSION=15.18
ARG PGVECTOR_VERSION=v0.8.3

# PGDG (apt.postgresql.org) and Debian's own repos don't ship
# postgresql-server-dev-15 for every architecture (e.g. armhf has no
# prebuilt binaries at all, only source). To get matching PGXS headers on
# any architecture, compile a throwaway PostgreSQL of the same major.minor
# version from source, purely to build pgvector against it.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  build-essential \
  flex \
  bison \
  perl \
  git \
  ca-certificates \
  curl \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL "https://ftp.postgresql.org/pub/source/v${PG_VERSION}/postgresql-${PG_VERSION}.tar.bz2" -o /tmp/postgresql.tar.bz2 \
  && mkdir /tmp/postgresql-src \
  && tar --no-same-permissions --no-same-owner -xjf /tmp/postgresql.tar.bz2 -C /tmp/postgresql-src --strip-components=1 \
  && cd /tmp/postgresql-src \
  && ./configure --prefix=/usr/local/pgsql --without-readline --without-zlib --without-icu --without-openssl \
  && make -j"$(nproc)" \
  && make install \
  && rm -rf /tmp/postgresql.tar.bz2 /tmp/postgresql-src

RUN git clone --branch ${PGVECTOR_VERSION} --depth 1 https://github.com/pgvector/pgvector.git /tmp/pgvector \
  && cd /tmp/pgvector \
  # OPTFLAGS="" disables pgvector's default -march=native, which bakes in
  # build-machine CPU instructions and segfaults at runtime in containers/VMs.
  && make OPTFLAGS="" PG_CONFIG=/usr/local/pgsql/bin/pg_config \
  && make OPTFLAGS="" PG_CONFIG=/usr/local/pgsql/bin/pg_config install \
  && rm -rf /tmp/pgvector

FROM postgres:15

COPY --from=pgvector-builder /usr/local/pgsql/lib/vector.so /usr/lib/postgresql/15/lib/vector.so
COPY --from=pgvector-builder /usr/local/pgsql/share/extension/vector* /usr/share/postgresql/15/extension/
