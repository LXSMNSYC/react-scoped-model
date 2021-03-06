# react-scoped-model-swr

> [react-scoped-model](https://github.com/lxsmnsyc/scoped-model) + [Vercel's SWR](https://swr.vercel.app/)

[![NPM](https://img.shields.io/npm/v/react-scoped-model-swr.svg)](https://www.npmjs.com/package/react-scoped-model-swr) [![JavaScript Style Guide](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/github/LXSMNSYC/scoped-model/tree/master/examples/react-scoped-model-swr)

## Usage

### Basic Usage

The package exports two model factories: `createSWRModel` and `createSWRInfiniteModel`.

```tsx
import { createSWRModel } from 'react-scoped-model';
```

The simplest form of an SWR Model can be created using just a key value.

```tsx
const TopItems = createSWRModel('/api/items/top');
```

which can be mounted like a scoped model instance:

```tsx
<TopItems.Provider>
  <TopItemsList />
</TopItems.Provider>
```

And can be used with hooks:

```tsx
import { useSelector } from 'react-scoped-model';

// ...
const data = useSelector(TopItems, (state) => state.data);
```

All SWR and SWR Infinite models are also subject to the `<SWRConfig>` setup.

The second parameter for `createSWRModel` is reserved for custom fetching, but it is required to be returned by a higher-order function:

```tsx
const TopItems = createSWRModel('/api/items/top', () => getTopItems);
```

The third parameter is an optional parameter and is for the [SWR Config](https://swr.vercel.app/docs/options).

```tsx
const TopItems = createSWRModel('/api/items/top', () => getTopItems, {
  initialData: [],
});
```

The fourth parameter is an optional parameter reserved for the scoped model options e.g. `displayName`.

### Props and Dependent Fetching

SWR and SWR Infinite models can also receive props, and can be used to produce dynamic key, fetcher and config, which can cause [dependent or conditional fetching](https://swr.vercel.app/docs/conditional-fetching);

```tsx
const UserDetails = createSWRModel(
  ({ userId }) => `/api/user/${userId}`,
  ({ userId }) => () => getUser(userId),
);

// ...
<UserDetails.Provider userId={userId}>
  <UserProfile />
</UserDetails.Provider>
```

You may also use hooks inside these functions as they behave as hooks:

```tsx
const RecentActivity = createSWRModel(
  () => {
    // Get the current sign-in token
    const token = useAuthToken();

    // Only fetch if a token exists,
    // signifying the signed-in user's presence
    if (token) {
      return ['/api/recent-activity', token];
    }
    return null,
  },
  () => getRecentActivity,
);
```

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
