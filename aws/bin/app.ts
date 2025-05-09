import * as cdk from "aws-cdk-lib";
import { FrontendStack } from "../lib/frontend.stack.ts";

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

new FrontendStack(app, "FrontendStack", { env });
