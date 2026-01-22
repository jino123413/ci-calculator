import { createRoute } from '@granite-js/react-native';
import CompoundInterestCalculator from '../src/components/CompoundInterestCalculator';

export const Route = createRoute('/', {
  validateParams: (params) => params,
  component: HomePage,
});

export function HomePage() {
  return <CompoundInterestCalculator />;
}
