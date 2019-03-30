import * as React from 'react';
import {createCustomMount} from '../mounts';

describe('createCustomMount()', () => {
  it('works', () => {
    const Context = React.createContext(1);

    const mount = createCustomMount<false, {number?: number}, {number: number}>(
      {
        context({number = 1}) {
          return {number};
        },
        render(element, context) {
          return (
            <Context.Provider value={context.number}>
              {element}
            </Context.Provider>
          );
        },
      },
    );

    function MyComponent() {
      return (
        <Context.Consumer>
          {number => <div>Number is: {number}</div>}
        </Context.Consumer>
      );
    }

    const myComponent = mount(<MyComponent />, {number: 3});
    console.log(myComponent.text());
  });
});
