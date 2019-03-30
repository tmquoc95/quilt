import * as React from 'react';

import {Root} from './root';
import {Element} from './element';

export {Root, Element};

export function mount<Props>(element: React.ReactElement<Props>) {
  return new Root<Props>(element);
}

export interface CustomMountOptions<
  Async extends boolean,
  MountOptions extends object,
  Context extends object
> {
  context: (options: MountOptions) => Context;
  render(
    element: React.ReactElement<any>,
    context: Context,
  ): React.ReactElement<any>;
  afterMount?(
    wrapper: CustomRoot<unknown, Context>,
    context: Context,
    options: MountOptions,
  ): Async extends true
    ? Promise<CustomRoot<unknown, Context>>
    : CustomRoot<unknown, Context>;
}

class CustomRoot<Props, Context extends object> extends Root<Props> {
  constructor(
    tree: React.ReactElement<Props>,
    render: CustomMountOptions<false, {}, Context>['render'],
    public readonly context: Context,
  ) {
    super(render(tree, context), element => element.find(tree.type));
  }
}

export function createCustomMount<
  Async extends boolean,
  MountOptions extends object,
  Context extends object
>({
  render,
  context: createContext,
  afterMount,
}: CustomMountOptions<Async, MountOptions, Context>): (
  element: React.ReactElement<any>,
  options?: MountOptions,
) => Async extends true
  ? Promise<CustomRoot<unknown, Context>>
  : CustomRoot<unknown, Context> {
  function mount<Props>(
    element: React.ReactElement<Props>,
    options?: MountOptions,
  ) {
    const context = createContext(options || ({} as any));
    const wrapper = new CustomRoot(element, render, context);
    return afterMount ? afterMount(wrapper, context, options || {}) : wrapper;
  }

  return mount as any;
}
