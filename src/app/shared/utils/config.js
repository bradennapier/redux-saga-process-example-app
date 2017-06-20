import _ from 'lodash';

const logging = process.env.NODE_ENV !== 'production';

const config = {
  // General App Information
  app: {
    name: 'Redux Saga Process Examples App',
    version: 1.0,
  },

  redux: {
    hot: true,
    use: {
      logger: logging,
      sagas: true,
    },
    logger: {
      collapsed: true,
      duration: true,
    },
  },

  processes: {
    enabled: true,
    config: {
      log: logging,
    },
  },
};

export default function getAppConfiguration(path, def) {
  return _.get(config, path, def);
}
