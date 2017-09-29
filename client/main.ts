import {Client} from "./client";

function App (io) {
    return new Client(io);
};

global.window.App = App;