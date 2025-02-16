import * as React from 'react';
import elephants from "./sad_elephant.png";
import {Link} from "react-router-dom";

/**
 * if user uses a link whose original-url is faulty
 */
class Page404 extends React.Component{
    render() {
        return (
            <div id={"page404"}>
                <p className={"appTitle notFoundTitle"}>tuffilink</p>
                <p id="homeTitle">Ooops! We did not find that page.</p>
                <img className={"sadElephantLogo"} src={elephants} alt="elephant-logo"/>
                <div>
                    <Link to="/" className="pageDirection">Click to visit tuffilink instead!</Link>
                </div>
            </div>
        )
    }

}

export default Page404;
