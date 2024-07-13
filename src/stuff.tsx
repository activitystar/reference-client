import React from 'react'
import { MultiformatReplica, ReplicaCache } from "https://cdn.earthstar-project.org/js/earthstar.web.v10.0.1.js";
import { useSyncExternalStore } from 'react'

export function useReplica(
  replica: typeof MultiformatReplica,
) {
  const cache = React.useMemo(
    () => {
      return new ReplicaCache(replica, 1000);
    },
    [replica],
  );

  const [version, setVersion] = React.useState(cache.version);

  React.useEffect(() => {
    setVersion(cache.version);

    return cache.onCacheUpdated(() => {
      setVersion(cache.version);
    });
  }, [cache]);

  const snapshot = React.useMemo(() => {
    return { cache, version };
  }, [version, cache]);

  const subscribe = (cb: () => void) => {
    return cache.onCacheUpdated(cb);
  };

  const obj = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => snapshot,
  );

  return obj.cache;
}
