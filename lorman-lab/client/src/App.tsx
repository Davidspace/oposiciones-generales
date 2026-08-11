import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import TcaeHome from "@/pages/tcae-home";
import TestTcaeSas from "@/pages/test-tcae-sas";
import NotFound from "@/pages/not-found";
import { MOODLE_URL } from "@/lib/portfolio-links";

function AulaRedirect() {
  window.location.replace(`${MOODLE_URL}/course/view.php?id=2`);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/tcae" component={TcaeHome}/>
      <Route path="/aula" component={AulaRedirect}/>
      <Route path="/test-tcae-sas" component={TestTcaeSas}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
