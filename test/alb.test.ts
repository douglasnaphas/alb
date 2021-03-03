import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Alb from '../lib/alb-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Alb.AlbStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
