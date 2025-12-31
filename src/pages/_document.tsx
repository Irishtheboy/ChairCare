import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html lang="en" className="dark">
				<Head>
					{/* Dark mode as default - mobile browser theme */}
					<meta name="theme-color" content="#000000" />
					<meta name="color-scheme" content="dark light" />
					
					{/* Favicon and app icons */}
					<link rel="favicon" href="/favicon.ico" />
					<link rel="icon" type="image/x-icon" href="/favicon.ico" />
					
					{/* Preload modern fonts for dark theme */}
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
					<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

					{/* Flaticon CSS for icons */}
					<link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css" />

					{/* Dark mode initialization script - runs before React hydration */}
					<script
						dangerouslySetInnerHTML={{
							__html: `
								(function() {
									// Set dark mode as default immediately
									document.documentElement.classList.add('dark');
									document.body.style.backgroundColor = '#000000';
									
									// Check for saved theme preference, default to dark
									const savedTheme = localStorage.getItem('chaircare-theme');
									if (savedTheme === 'light') {
										document.documentElement.classList.remove('dark');
										document.documentElement.classList.add('light');
										document.body.style.backgroundColor = '#ffffff';
									} else {
										// Ensure dark mode is set
										localStorage.setItem('chaircare-theme', 'dark');
									}
								})();
							`
						}}
					/>

					{/* Global Site Tag (gtag.js) - Google Analytics */}
					<script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`} />
					<script
						dangerouslySetInnerHTML={{
							__html: `
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', '${process.env.GA_TRACKING_ID}', {
									page_path: window.location.pathname,
								});
							`
						}}
					/>
				</Head>
				<body className="dark">{/* Default dark class on body */}
					<noscript
						dangerouslySetInnerHTML={{
							__html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.GA_TRACKING_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
						}}
					></noscript>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
