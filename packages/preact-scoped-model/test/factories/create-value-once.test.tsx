/* @jsx h */
import { Fragment, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { cleanup, render, screen } from '@testing-library/preact';
import createModel, { createValueOnce } from '../../src';
import { supressWarnings, restoreWarnings } from '../suppress-warnings';

import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';

afterEach(cleanup);

describe('createValueOnce', () => {
  it('should receive the value supplied by the model.', () => {
    const expected = 'Hello World';
    const finder = 'example';
    const Example = createModel(() => expected);
    const useExample = createValueOnce(Example);

    function Consumer(): JSX.Element {
      const value = useExample();

      return (
        <p title={finder}>{ value }</p>
      );
    }

    render(
      <Example.Provider>
        <Consumer />
      </Example.Provider>,
    );

    expect(screen.getByTitle(finder)).toContainHTML(expected);
  });
  it('should not re-render if the scoped model value changes', () => {
    const finder = 'example';
    const expected = 'Default';

    const Example = createModel(() => {
      const [state, setState] = useState(expected);
      useEffect(() => {
        setState('Changed');
      }, []);

      return state;
    });
    const useExample = createValueOnce(Example);

    function Consumer(): JSX.Element {
      const value = useExample();

      return (
        <p title={finder}>{ value }</p>
      );
    }

    render(
      <Example.Provider>
        <Consumer />
      </Example.Provider>,
    );

    expect(screen.getByTitle(finder)).toContainHTML(expected);
  });
  it('should throw an error if the model is not mounted before accessing.', () => {
    const Expected = createModel(() => 'Test');
    const useExample = createValueOnce(Expected);

    function Consumer(): JSX.Element {
      useExample();

      return <Fragment>Test</Fragment>;
    }

    supressWarnings();
    expect(() => {
      render(<Consumer />);
    }).toThrowError();
    restoreWarnings();
  });
});