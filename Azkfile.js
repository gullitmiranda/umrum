systems({
  umrum: {
    // Dependent systems
    depends: ["redis", "mongodb"],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/node"},
    // Steps to execute before running instances
    provision: [
      "npm install",
      "grunt compile"
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: "grunt server",
    wait: {"retry": 20, "timeout": 10000},
    mounts: {
      '/azk/#{manifest.dir}': path(".", { vbox: true } ),
    },
    scalable: {"default": 2},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      http: "8000"
    },
    envs: {
      // set instances variables
      NODE_ENV: "dev",
      PATH: "node_modules/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      // MONGO_URI: "mongodb://test:test123@ds053778.mongolab.com:53778/umrum-test",
      NODE_PORT: "8000",
      PORT: "8000",
      NODE_IP: "0.0.0.0"
    },
  },

  redis: {
    image: { docker: "dockerfile/redis" },
    scalable: false,
    ports: {
      data: "6379/tcp",
    },
    export_envs: {
      REDIS_URL: "redis://#{net.host}:#{net.port.data}/#{manifest.dir}"
    },
    mounts: {
      '/data' : persistent('redis'),
    },
  },

  mongodb: {
    image: { docker: "dockerfile/mongodb" },
    command: 'mongod --rest --httpinterface',
    scalable: false,
    ports: {
      http: "28017",
    },
    http: {
      domains: [ "#{manifest.dir}-#{system.name}.#{azk.default_domain}" ],
    },
    mounts: {
      '/data/db': persistent('mongodb'),
    },
    export_envs: {
      MONGODB_URI: "mongodb://#{net.host}:#{net.port[27017]}/umrum_development",
    },
  }
});
