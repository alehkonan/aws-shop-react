import * as cdk from "aws-cdk-lib";
import { FrontendStack } from "../lib/frontend.ts";

const app = new cdk.App();

new FrontendStack(app, "FrontendStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
