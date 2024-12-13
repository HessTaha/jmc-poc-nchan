# Use an official Ubuntu as the base image
FROM ubuntu:22.04

# Set environment variables to non-interactive for apt
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
        build-essential \
        git \
        libpcre3-dev \
        zlib1g-dev \
        libssl-dev \
        wget \
        curl \
        ca-certificates \
        && rm -rf /var/lib/apt/lists/*

# Define versions
ENV NGINX_VERSION=1.24.0
ENV NCHAN_VERSION=1.3.3

# Create a user and group for Nginx
RUN groupadd -r nginx && useradd -r -g nginx nginx

# Download and extract Nginx
WORKDIR /usr/src
RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar -zxvf nginx-${NGINX_VERSION}.tar.gz

# Clone the Nchan repository
RUN git clone https://github.com/slact/nchan.git && \
    cd nchan && \
    git checkout tags/v${NCHAN_VERSION} -b v${NCHAN_VERSION}

# Configure and compile Nginx with Nchan module
WORKDIR /usr/src/nginx-${NGINX_VERSION}
RUN ./configure \
        --prefix=/etc/nginx \
        --sbin-path=/usr/sbin/nginx \
        --modules-path=/usr/lib/nginx/modules \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --pid-path=/var/run/nginx.pid \
        --lock-path=/var/run/nginx.lock \
        --with-http_ssl_module \
        --with-http_stub_status_module \
        --with-stream \
        --add-module=/usr/src/nchan \
    && make && make install

# Remove build dependencies to reduce image size
RUN apt-get purge -y --auto-remove \
        build-essential \
        git \
        libpcre3-dev \
        zlib1g-dev \
        libssl-dev \
        wget \
    && rm -rf /usr/src/* /var/lib/apt/lists/*

# Create necessary directories
RUN mkdir -p /var/cache/nginx /var/run/nginx /usr/share/nginx/html/visualize /var/log/nginx

# Set ownership for directories
RUN chown -R nginx:nginx /etc/nginx /var/cache/nginx /var/run/nginx /usr/share/nginx/html /var/log/nginx /var/run/

# Copy custom nginx.conf
COPY nchan/nginx.conf /etc/nginx/nginx.conf

# Copy visualization files
COPY python/static/visualize/index.html /usr/share/nginx/html/visualize/index.html

# Expose necessary ports
EXPOSE 8080

# Switch to non-root user
USER nginx

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
