import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AppLayout } from '@/components/AppLayout';

import Studio from '@/pages/Studio';
import Templates from '@/pages/Templates';
import Library from '@/pages/Library';
import Learn from '@/pages/Learn';
import Engines from '@/pages/Engines';
import Collab from '@/pages/Collab';
import Profile from '@/pages/Profile';

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Studio} />
        <Route path="/templates" component={Templates} />
        <Route path="/library" component={Library} />
        <Route path="/learn" component={Learn} />
        <Route path="/engines" component={Engines} />
        <Route path="/collab" component={Collab} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
