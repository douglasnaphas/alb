import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as Alb from "../lib/alb-stack";

const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
});
afterAll(() => {
  process.env = { ...OLD_ENV };
});
test("can instantiate stack", () => {
  const app = new cdk.App();
  process.env.GITHUB_REPOSITORY = "aws-cdk/alb";
  process.env.GITHUB_REF = "refs/heads/main";
  // ALB access logging requires the region to be specified
  // https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-elasticloadbalancingv2.ApplicationLoadBalancer.html#logwbraccesswbrlogsbucket-prefix
  // We do this by setting env.region to AWS_DEFAULT_REGION when we instantiate
  // the stack.
  process.env.AWS_DEFAULT_REGION = "us-east-1";
  const stack = new Alb.AlbStack(app, "MyTestAlbStack", {
    env: { region: process.env.AWS_DEFAULT_REGION },
  });
});
