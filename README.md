# serverless-typescript-layers-template

This is a template for project that use the following technologies:

- Serverless Framework
- TypeScript
- Layers for AWS Lambda

## Context

Serverless Framework uses EsBuild by default. This works great if the project is not using TypeScript and layers for AWS
Lambda. If you add them, you will have to install your layers as a NPM package and exclude it from EsBuild. That means
that for each layer you will need a package project with some bundler. Also, everytime you do a change in the layer's
code you will have to bundle that project so its changes would be reflected in the main project.

Serverless Framework can work without EsBuild. In that situation, it will only package the code and upload it. In that
case, we can use our own bundle system and let Serverless Framework do only the packaging and deployment process. It can
really be any bundler, but it should be one that you can completely control, so you can produce the functions' code and
layers' code.

## What we win

With this approach, we don't need to manage separate projects, but separate bundles, so we can use our already
configured tools like TypeScript, EsLint or Prettier. This also removes the task of bundle every time you do a change in
your layer. Finally, it gives you complete control over how the bundles are made.

## How this works

First, we use the "paths" feature of TypeScript. For each layer, we will be using a path. Everytime we import a file
from a layer, we will be using its path. When the code is transpiled, it will keep that import reference, so Node will
treat it as a package.

Then we use Webpack. It has two configuration. One for the functions' code and one for the layers' code.

The Webpack configuration for the functions will need an entry point for each function. It will also use the "exclude"
feature of Webpack. It will exclude the layers using the path we set in TypeScript. Since we use those paths in our
code, it will understand that it should not bundle those layers here. It will also exclude all the NPM dependencies. The
minimizer will be disabled so the code is readable in the AWS Console.

The Webpack configuration for the layers will need an entry point for each layer. Each layer will also contain the NPM
package they are using. This is handler automatically by Webpack. Also, each bundle produced here will have the folder
structure required by the AWS Lambda's layers feature. Note that we need to build our layer like a package, so it should
have an index file from which it will export its other files.

In the Serverless Framework we set the handler for every function to the file produced by Webpack, in the "dist" folder.
Also, since by default the tool will package the entire project, we set and include/exclude configuration, so it only
includes the files from the bundle.

At the end, every bundle produces will be stored in the "dist" folder. Then Serverless Framework takes each bundle, zips
them
individually and uploads them.

## Try it

Run `npm run bundle` so you can see how the bundles are made. The functions' code will only code the code from the
functions' file and reference the layers they are using. Since it's not being minimized, it should be "readable". The
layers' code will be under the folder structure required by the AWS Lambda's layers feature, and it will be minimized.

Run `npm run build:dev` so you can see how Serverless Framework packages the bundles. Note that this requires you to
configure in your host an AWS profile named "general/dev".
