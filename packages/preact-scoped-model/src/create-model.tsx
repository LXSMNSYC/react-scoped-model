/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2020
 */
/* @jsx h */
import {
  h,
  createContext,
  Context,
  FunctionComponent,
} from 'preact';
import { useContext } from 'preact/hooks';
import { memo } from 'preact/compat';
import { AccessibleObject } from './types';
import Notifier from './notifier';
import useConstant from './hooks/useConstant';
import generateId from './utils/id';
import MissingScopedModelError from './utils/MissingScopedModelError';
import useIsomorphicEffect from './hooks/useIsomorphicEffect';

export type ScopedModelHook<Model, Props extends AccessibleObject = AccessibleObject> =
  (props: Props) => Model;

export type ScopedModelMemo<Props extends AccessibleObject = AccessibleObject> =
  (prev: Props, next: Props) => boolean;

export interface ScopedModelOptions<Props extends AccessibleObject = AccessibleObject> {
  displayName?: string;
  defaultProps?: Partial<Props>;
  shouldUpdate?: ScopedModelMemo<Props>;
}

export interface ScopedModel<Model, Props extends AccessibleObject = AccessibleObject> {
  context: Context<Notifier<Model> | null>;
  Provider: FunctionComponent<Props>;
  displayName: string;
}

export type ScopedModelModelType<T> =
  T extends ScopedModel<infer U, any> ? U : T;
export type ScopedModelPropsType<T> =
  T extends ScopedModel<any, infer U> ? U : T;
/**
 * Creates a scoped model instance that generates a state from a given
 * Preact-based hook function which allows fine-grained control on injected
 * contextual state within the component tree.
 * @param useModelHook
 * @param options
 */
export default function createModel<Model, Props extends AccessibleObject = AccessibleObject>(
  useModelHook: ScopedModelHook<Model, Props>,
  options: ScopedModelOptions<Props> = {},
): ScopedModel<Model, Props> {
  const context = createContext<Notifier<Model> | null>(null);
  const id = generateId();
  /**
   * Display name for the model
   */
  const displayName = options.displayName || `ScopedModel-${id}`;

  const ProcessorInner: FunctionComponent<Props> = (props) => {
    const emitter = useContext(context);

    if (!emitter) {
      throw new MissingScopedModelError(displayName);
    }

    const model = useModelHook(props as Props);

    emitter.sync(model);

    useIsomorphicEffect(() => {
      emitter.consume(model);
    }, [emitter, model]);

    return null;
  };

  const Processor = memo(
    ProcessorInner,
    options.shouldUpdate,
  );

  ProcessorInner.displayName = `${displayName}.Processor`;
  Processor.displayName = `${displayName}.Processor`;

  const Provider: FunctionComponent<Props> = ({ children, ...props }) => {
    const emitter = useConstant(() => new Notifier({} as Model));

    return (
      <context.Provider value={emitter}>
        <Processor {...props as Props} />
        { children }
      </context.Provider>
    );
  };

  /**
   * Provider default props
   */
  Provider.defaultProps = {
    ...options.defaultProps,
    children: undefined,
  };

  /**
   * Display name for the Provider
   */
  Provider.displayName = displayName;
  context.Provider.displayName = `${displayName}.Provider`;

  return {
    context,
    Provider,
    displayName,
  };
}