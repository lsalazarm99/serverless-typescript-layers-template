# serverless-typescript-layers-template

This is a template for project that use the following technologies:

- Serverless Framework
- TypeScript
- Layers for AWS Lambda

## Context

Serverless Framework uses EsBuild by default. This works great if the project is not using TypeScript and layers for AWS
Lambda. If you add them, you will have to install your layers as a NPM package and exclude it from EsBuild. That means
that for each layer you will need a package project with some bundler. Also, everytime you do a change in the layer you
will have to bundle that project so its changes would be reflected in the main project.

Serverless Framework can work without EsBuild. In that situation, it will only package the code and upload it, so we can
use our own bundle system and let Serverless Framework do only the packaging and deployment process. It can really be
any bundler, but it should be one that you can completely control, so you can produce the functions' code and layers'
code.

## What we win

With this approach, we don't need to manage separate projects, but separate bundles, so we can use our already
configured tools like TypeScript, EsLint or Prettier. This also removes the task of bundle every time you do a change in
your layer. Finally, it gives you complete control over how the bundles are made.

## How this works

First, we use the "paths" feature of TypeScript. For each layer, we will be using a path. Everytime we import a file
from a layer, we will be using its path. When the code is transpiled, it will keep that import reference, so Node will
treat it as a package.

Then we use Webpack. It has two configuration. One for the functions and one for the layers.

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
them individually and uploads them.

## How to add a function

1. Add your handler file in the "webpack.functions.ts" file as an entry point.
2. Add your function's configuration in the "serverless.yml" file. Note that here as the handler you should specify the
   bundled function's code under the "dist" folder instead of the source function's code. Since by default Serverless
   Framework includes every file in the project inside the generated zip, you should exclude all the files and
   directories and then include only the bundled function's folder.

As an example, this template contains one function named "sayHello".

## How to add a layer

0. Your layer should be created in a "package-like" structure. It means that it should be placed inside a dedicated
   folder and in its root it should have an index file that exports your layer's code. You can find two examples of it
   in this template.
1. Add your layer's index file in the "webpack.layers.ts" as an entry point.
2. Add your layer's folder in the "tsconfig.base.json" file as a path. Note that the path name should be the same you
   used in the Webpack's entry point configuration.
3. Add your layer's configuration in the "serverless.yml" file. Note that here as the path you should specify the
   bundled layer's folder under the "dist" folder.

As an example, this template contains two layers named "general" and "hello_world_producer".

## How to use a layer

When you import your layer in your function, you should import it using the path you set for your layer in the
"tsconfig.base.json" file.

## How to use a dependency in a function

Since you are using layers, you want your functions to contain only the functions' code. That means that your
dependencies should be placed somewhere else. Normally you only need your dependency for your layers, so you can simply
install them and use them because they will be bundled with your layers.

If you need to use a dependency directly un your function, you should reexport that dependency from a layer and then
import it from that layer in your function.

You can find an example of that behavior in the "sayHello" function of this template. It uses the "Chance" class from
the "Chance" dependency, which is reexported by the "general" layer.

## Try it

Run `npm run bundle` so you can see how the bundles are made. The functions' code will only contain the code from the
functions' file and reference the layers they are using. Since it's not being minimized, it should be "readable". The
layers' code will be under the folder structure required by the AWS Lambda's layers feature, and it will be minimized.

Run `npm run build:dev` so you can see how Serverless Framework packages the bundles. Note that this requires you to
configure in your host an AWS profile named "general/dev".
