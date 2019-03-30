import * as React from 'react';

import {Root} from '../root';
import {mount, createCustomMount} from '../mount';
import {destroyAll} from '../destroy';

describe('mount()', () => {
  afterEach(() => {
    destroyAll();
  });

  it('constructs and returns a root element', () => {
    const root = mount(<div>Hello world</div>);
    expect(root).toBeInstanceOf(Root);
    expect(document.body.firstElementChild!.innerHTML).toBe(
      '<div>Hello world</div>',
    );
  });
});

describe('createCustomMount()', () => {
  it('calls context() with the passed options', () => {
    const spy = jest.fn();
    const options = {foo: 'bar'};

    const customMount = createCustomMount<typeof options>({
      context: spy,
      render: element => element,
    });

    customMount(<div />, options);

    expect(spy).toHaveBeenCalledWith(options);
  });

  it('stores the result of calling context() on Root#context', () => {
    const context = {foo: 'barbaz'};
    const customMount = createCustomMount<{}, typeof context>({
      context: () => context,
      render: element => element,
    });

    const div = customMount(<div />);

    expect(div).toHaveProperty('context', context);
  });

  it('calls render with the element, context, and options', () => {
    const options = {foo: 'bar'};
    const context = {bar: 'baz'};
    const element = <div />;
    const spy = jest.fn((element: React.ReactElement<{}>) => element);

    const customMount = createCustomMount<typeof options, typeof context>({
      context: () => context,
      render: spy,
    });

    customMount(<div />, options);

    expect(spy).toHaveBeenCalledWith(element, context, options);
  });

  it('resolves the returned Root instance to the top level node in the original tree', () => {
    const customMount = createCustomMount({
      render: element => <span id="ShouldNotBeFound">{element}</span>,
    });

    const div = customMount(<div />);

    expect(div).toHaveProperty('type', 'div');
    expect(div).not.toContainReactComponent('span', {id: 'ShouldNotBeFound'});
  });

  it('calls afterMount with the wrapper and options', () => {
    const spy = jest.fn();
    const options = {foo: 'bar'};

    const customMount = createCustomMount<typeof options>({
      render: element => element,
      afterMount: spy,
    });

    const div = customMount(<div />, options);

    expect(spy).toHaveBeenCalledWith(div, options);
  });

  it('returns a promise for the wrapper if afterMount returns a promise', async () => {
    const customMount = createCustomMount<{}, {}, true>({
      render: element => element,
      afterMount: () => Promise.resolve(),
    });

    const div = customMount(<div />);

    expect(div).toBeInstanceOf(Promise);
    await expect(div).resolves.toBeInstanceOf(Root);
  });
});
