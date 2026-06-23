import React from "react";

type ServiceFn<T> = (...args: any[]) => T;

type ServiceBundle<Name extends string, T> = {
  [K in `${Name}ServiceContext`]: React.Context<ServiceFn<T> | null>;
} & {
  [K in `${Name}ServiceProvider`]: React.FC<
    React.PropsWithChildren<{ service: ServiceFn<T> }>
  >;
} & {
  [K in `use${Name}Service`]: <F extends ServiceFn<T>>(
    options?: Parameters<F>[0],
  ) => T;
};

export const createService = <T, Name extends string = string>(
  name: Name,
): ServiceBundle<Name, T> => {
  const ServiceContext = React.createContext<ServiceFn<T> | null>(null);

  const ServiceProvider: React.FC<
    React.PropsWithChildren<{ service: ServiceFn<T> }>
  > = ({ children, service }) => (
    <ServiceContext.Provider value={service}>
      {children}
    </ServiceContext.Provider>
  );

  const useService = <F extends ServiceFn<T>>(
    options?: Parameters<F>[0],
  ): T => {
    const service = React.useContext(ServiceContext);
    if (!service) {
      throw new Error(
        `use${name}Service must be used within a ${name}ServiceProvider`,
      );
    }
    return service(options);
  };

  return {
    [`${name}ServiceContext`]: ServiceContext,
    [`${name}ServiceProvider`]: ServiceProvider,
    [`use${name}Service`]: useService,
  } as ServiceBundle<Name, T>;
};
