import { render } from "@testing-library/react";
import Title from "../Title";
import { Provider } from "react-redux";
import store from "../../../utils/store";
import {StaticRouter} from "react-router-dom/server"



test ("logo should load on after rendering title", () =>{
     // load header component or title 
     
     const title =  render(
    <StaticRouter>
     <Provider store={store}>
      <Title />
     </Provider>
     </StaticRouter>
     
);
const logo = title.getAllByTestId("logo");

expect(logo.length).toBe(1);
expect(logo[0].getAttribute("aria-label")).toBe("BeYuumi — food delivers joy");
     
})

test ("OnlineStatus should load on after rendering title", () =>{
    // load header component or title 
    
    const title =  render(
   <StaticRouter>
    <Provider store={store}>
     <Title />
    </Provider>
    </StaticRouter>
    
);
const checkOnline = title.getByTestId("onlineStatus");

expect(checkOnline.textContent).toBe("Online");
    
});

test ("OnlineStatus should load on after rendering title", () =>{
    // load header component or title 
    
    const title =  render(
   <StaticRouter>
    <Provider store={store}>
     <Title />
    </Provider>
    </StaticRouter>
    
);
const checkOnline = title.getByTestId("onlineStatus");

expect(checkOnline.textContent).toBe("Online");
    
}); 



test ("cart item should be empty on after rendering title", () =>{
    // load header component or title 
    
    const title =  render(
   <StaticRouter>
    <Provider store={store}>
     <Title />
    </Provider>
    </StaticRouter>
    
);
// check if cart is empyty or not after initial render
const cart  = title.getByTestId("cartTest");

expect(cart.textContent).toBe("0");
    
}); 