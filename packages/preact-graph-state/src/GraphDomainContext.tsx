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
import { createContext } from 'preact';
import { Ref, useContext } from 'preact/hooks';
import { GraphNode, GraphNodeDraftState } from './graph-node';
import { GraphNodeListener } from './core/types';
import OutOfGraphDomainError from './utils/OutOfGraphDomainError';
import IllegalGraphDomainInterfaceAccessError from './utils/IllegalGraphDomainInterfaceAccessError';

export interface GraphCoreInterface {
  updateState: <R>(dependency: GraphNode<R>, newAction: GraphNodeDraftState<R>) => void;
  addListener: <R>(node: GraphNode<R>, listener: GraphNodeListener<R>) => void;
  removeListener: <R>(node: GraphNode<R>, listener: GraphNodeListener<R>) => void;
  getState: <R>(node: GraphNode<R>) => R;
}

export interface GraphCoreValue {
  value?: GraphCoreInterface;
}

export const GraphDomainContext = (
  createContext<Ref<GraphCoreValue> | undefined>(undefined)
);

export function useGraphDomainContext(): Ref<GraphCoreValue> {
  const context = useContext(GraphDomainContext);

  if (context) {
    return context;
  }

  throw new OutOfGraphDomainError();
}

export function useGraphDomainInterface(): GraphCoreInterface {
  const { current } = useGraphDomainContext();

  if (current.value) {
    return current.value;
  }

  throw new IllegalGraphDomainInterfaceAccessError();
}