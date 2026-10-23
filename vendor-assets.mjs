// Copies the npm packages the plugin ships into grails-app/assets/vendor-external, keeping the layout asset `require` paths expect.
import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';

const outDir = 'grails-app/assets/vendor-external';

// null copies all browser files from the package's dist/ (or release/) folder, else its root; a list copies only those files
const packages = {
	'underscore': ['underscore-min.js', 'underscore.js'],
	'jquery': null,
	'jquery-inview': null,
	'handlebars': ['handlebars.js'],
	'leaflet': null,
	'@geoman-io/leaflet-geoman-free': null,
	'leaflet.coordinates': null,
	'leaflet-easybutton': null,
	'leaflet-control-geocoder': null,
	'leaflet.markercluster': null,
	'leaflet-loading': null,
	'leaflet-sleep': null,
	'font-awesome': null,
	'urijs': null,
	'leaflet-plugins': null,
	'leaflet.gridlayer.googlemutant': null,
	'@tmcw/togeojson': null,
	'leaflet-filelayer': null,
};

const included = /\.(css|js|eot|svg|ttf|woff2?|ts|jpe?g|png|gif)$/;
const excluded = /\.min\.(js|css)$|(^|\/)Gruntfile\.js$|^gulpfile\.js$|^source\/|(^|\/)node_modules\//;
const isDirectory = (path) => existsSync(path) && statSync(path).isDirectory();

for (const [name, files] of Object.entries(packages)) {
	const root = join('node_modules', name);
	if (!isDirectory(root)) {
		throw new Error(`${name} is not installed; declare it in package.json and run npm ci`);
	}
	const src = ['dist', 'release'].map((dir) => join(root, dir)).find(isDirectory) ?? root;
	const dest = join(outDir, name);
	rmSync(dest, { recursive: true, force: true });
	const selected = files ?? readdirSync(src, { recursive: true })
		.map((path) => path.split(sep).join('/'))
		.filter((path) => included.test(path) && !excluded.test(path) && statSync(join(src, path)).isFile());
	for (const file of selected) {
		cpSync(join(src, file), join(dest, file));
	}
}
