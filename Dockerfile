FROM ruby:3.1.2
RUN  curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
  && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && apt-get update -qq \
  && apt-get install -y nodejs yarn fonts-ipafont-mincho default-mysql-client \
  && mkdir /app


ENV BUNDLE_PATH=/usr/local/bundle
WORKDIR /app
COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
RUN bundle install

#CMD ["rails", "server", "-b", "0.0.0.0"]
