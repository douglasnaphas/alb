import * as cdk from "@aws-cdk/core";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as s3 from "@aws-cdk/aws-s3";

export class AlbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const accessLogBucket = new s3.Bucket(this, "albAccessLogBucket");
    const vpc = new ec2.Vpc(this, "VPC");
    const lb = new elbv2.ApplicationLoadBalancer(this, "LB", {
      vpc,
      internetFacing: true,
    });
    lb.logAccessLogs(accessLogBucket);
    const listener = lb.addListener("HttpsListener", {
      port: 80,
      open: true,
    });
    listener.addAction("DefaultAction", {
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: elbv2.ContentType.TEXT_PLAIN,
        messageBody: "OK-default-response",
      }),
    });
    listener.addAction("OkAction", {
      priority: 10,
      conditions: [elbv2.ListenerCondition.pathPatterns(["/ok"])],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: elbv2.ContentType.TEXT_PLAIN,
        messageBody: "OK-ok-response",
      }),
    });

    new cdk.CfnOutput(this, "loadBalancerDnsName", {
      value: lb.loadBalancerDnsName,
    });
    new cdk.CfnOutput(this, "logBucketName", {
      value: accessLogBucket.bucketName,
    });
  }
}
