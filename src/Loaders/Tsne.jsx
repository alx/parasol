import { DeepDetect } from 'deepdetect-js';

class Tsne {

  network = null;

  constructor(network, colors) {
    this.network = network;
  }

  run(callback) {

    const network = this.network;

    network.get('options').layout = 'none';

    const deepdetect = new DeepDetect('/api');

    const service_name = 'parasoltest';

    const service_params = {
      mllib:"tsne",
      description:"clustering",
      type:"unsupervised",
      parameters:{
        input:{connector:"csv"},
        mllib:{},
        output:{}
      },
      model:{
        repository:"/tmp"
      }
    };

    const train_params = {
      service: service_name,
      'async':false,
      parameters:{
        input:{
          id:"",
          separator:",",
          label:"label"
        },
        mllib:{
          iterations:500
        },
        output:{}
      },
      data:[network.get('url')]
    };

    network.set('status', 'loading...');

    deepdetect.services.create(service_name, service_params).then(function (response) {

      network.set('status', 'training...');

      deepdetect.train.launch(train_params).then(function (response) {

        network.set('status', 'complete');

        deepdetect.services.delete(service_name);

        network.set('graph', {
          nodes: response.body.predictions.map( prediction => {
            return {
              id: prediction.uri,
              x: prediction.vals[0],
              y: prediction.vals[1],
              color: '#9e9e9e',
            };
          }),
          edges: []
        });

      }, () => {
        network.set('status', 'Failed on training');
      });
    }, () => {
        network.set('status', 'Failed on service creation');
    });

  }

}

export default Tsne;
