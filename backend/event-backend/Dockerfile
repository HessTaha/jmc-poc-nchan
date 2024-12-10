FROM rust:1.80 AS base
RUN cargo install cargo-chef --version ^0.1
WORKDIR /app

FROM base AS planner
WORKDIR /app
COPY  . .
RUN cargo chef prepare --recipe-path recipe.json

FROM base AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim AS runtime
WORKDIR /app
COPY --from=builder /app/target/release/event-backend .
EXPOSE 8080
ENTRYPOINT ["./event-backend"]