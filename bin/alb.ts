#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AlbStack } from "../lib/alb-stack";
const stackname = require("@cdk-turnkey/stackname");

const app = new cdk.App();
new AlbStack(app, stackname(), {
  env: { region: process.env.AWS_DEFAULT_REGION },
});
