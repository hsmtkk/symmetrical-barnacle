// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import { Construct } from "constructs";
import { App, TerraformStack, CloudBackend, NamedCloudWorkspace } from "cdktf";
import * as google from '@cdktf/provider-google';

const project = 'symmetrical-barnacle';
const region = 'us-central1';
const zone = 'us-central1-a';

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new google.provider.GoogleProvider(this, 'google', {
      project,
      region,
    });

    new google.computeInstance.ComputeInstance(this, 'controller', {
      bootDisk: {
        initializeParams: {
          image: 'debian-cloud/debian-11',
        },
      },
      machineType: 'e2-small',
      name: 'controller',
      networkInterface: [{
        accessConfig: [{}],
        network: 'default',
      }],
      scheduling: {
        automaticRestart: false,
        preemptible: true,
        provisioningModel: 'SPOT',
      },
      zone,      
    });    

    new google.computeInstance.ComputeInstance(this, 'worker', {
      bootDisk: {
        initializeParams: {
          image: 'debian-cloud/debian-11',
        },
      },
      machineType: 'e2-small',
      name: 'worker',
      networkInterface: [{
        accessConfig: [{}],
        network: 'default',
      }],
      scheduling: {
        automaticRestart: false,
        preemptible: true,
        provisioningModel: 'SPOT',
      },
      zone,      
    });    

  }
}

const app = new App();
const stack = new MyStack(app, "symmetrical-barnacle");
new CloudBackend(stack, {
  hostname: "app.terraform.io",
  organization: "hsmtkkdefault",
  workspaces: new NamedCloudWorkspace("symmetrical-barnacle")
});
app.synth();
