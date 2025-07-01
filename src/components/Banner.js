import React, { Component } from 'react';

 class Banner300by250 extends Component {
    bannerRef: React.RefObject<HTMLDivElement>;  // Defining the ref type

    constructor(props: any) {
        super(props);
        this.bannerRef = React.createRef();  // Initializing the ref
    }

    componentDidMount() {
        const banner = this.bannerRef.current;

        const atOptions = {
            key: '5c1e73d93e798f3a668723cef614e7c2',
            format: 'iframe',
            height: 50,
            width: 320,
            params: {},
        };

        if (banner && !banner.firstChild) {
            const conf = document.createElement('script');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `//www.topcreativeformat.com/${atOptions.key}/invoke.js`;
            conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

            banner.appendChild(conf);
            banner.appendChild(script);
        }
    }

    render() {
        return (
            <div
                className="mx-2 my-2  justify-center items-center text-white text-center"
                ref={this.bannerRef}  // Use the ref in class component
            ></div>
        );
    }
}



 class Banner728by90 extends Component {
    bannerRef: React.RefObject<HTMLDivElement>;  // Defining the ref type

    constructor(props: any) {
        super(props);
        this.bannerRef = React.createRef();  // Initializing the ref
    }

    componentDidMount() {
        const banner = this.bannerRef.current;

        const atOptions = {
        'key' : 'e605f60598d3287ad619869d3c5a21a5',
        'format' : 'iframe',
        'height' : 90,
        'width' : 100,
        'params' : {}
        };

        if (banner && !banner.firstChild) {
            const conf = document.createElement('script');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `//www.topcreativeformat.com/${atOptions.key}/invoke.js`;
            conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

            banner.appendChild(conf);
            banner.appendChild(script);
        }
    }

    render() {
        return (
            <div
                className="mx-2 my-2   justify-center items-center text-white text-center"
                ref={this.bannerRef}  // Use the ref in class component
            ></div>
        );
    }
}

export { Banner300by250,Banner728by90 };