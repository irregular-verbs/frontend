/**
 * --------------------------------------------------------------------
 * Copyright 2015 Nikolay Mavrenkov
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * --------------------------------------------------------------------
 *
 * Author:  Nikolay Mavrenkov <koluch@koluch.ru>
 * Created: 03.11.2015 22:56
 */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    anybar = require('anybar'),
    fs = require('fs'),
    babelify = require('babelify'),
    babelPresetEs2015 = require('babel-preset-es2015'),
    serve = require('gulp-serve'),
    envify = require('gulp-envify'),
    merge = require('merge-stream'),
    manifest = require('gulp-manifest'),
    through2 = require('through2'),
    packageJson = require('./package.json') || {};


// Read settings from package.json
var settingsGulp = packageJson.gulp || {}
var settingsSrc = settingsGulp.src || {}
var settingsDebug = settingsGulp.debug || {}
var settingsProd = settingsGulp.prod || {}

var DEBUG_ROOT = settingsDebug.root || './debug'
var SRC_ROOT = settingsSrc.root || '.'
var PROD_ROOT = settingsProd.root || './prod'
var DEBUG_HOSTNAME = settingsDebug.hostname || "localhost"
var DEBUG_PORT = settingsDebug.port || "8000"

function onError(err) {
    gutil.log(gutil.colors.red(err.message))
}


gulp.task('static', function(){
    var files = SRC_ROOT + '/static/**/*'
    return gulp.src(files)
        .pipe(gulp.dest(PROD_ROOT))
})

gulp.task('scripts_vendor', function(){
    var bundler = browserify("", {
        debug: false,
        cache: {},
        packageCache: {},
        fullPaths: true,
        extensions: [".js", ".jsx"],
        require: Object.keys(packageJson.dependencies)
    })

    bundler = bundler.transform(babelify, {
        global: true,
        presets: [babelPresetEs2015]
    })

    return bundler.bundle()
        .on('error',  onError)
        .pipe(source('vendor.js'))
        .on('error', onError)
        .pipe(streamify(envify({NODE_ENV: 'production'})))
        .on('error', onError)
        .pipe(streamify(uglify()))
        .on('error', onError)
        .pipe(gulp.dest(PROD_ROOT + '/scripts'))
        .on('error', onError)
})


gulp.task('scripts', function(){
    function makeBundle(entryPoint, dest) {
        var bundler = browserify(entryPoint, {
            debug: false,
            cache: {},
            packageCache: {},
            fullPaths: true,
            extensions: [".js", ".jsx"]
        })

        // Register all dependencies as external (they are loaded via vendor bundle)
        Object.keys(packageJson.dependencies).forEach(function(dep){
            bundler.external(dep)
        })

        bundler = bundler.transform(babelify, {
            global: true,
            presets: [babelPresetEs2015]
        })

        return bundler.bundle()
            .on('error',  onError)
            .pipe(source(dest))
            .on('error', onError)
            .pipe(streamify(envify({NODE_ENV: 'production'})))
            .on('error', onError)
            .pipe(streamify(uglify()))
            .on('error', onError)
            .pipe(gulp.dest(PROD_ROOT + '/scripts'))
            .on('error', onError)
    }

    return merge(
        makeBundle(SRC_ROOT + '/scripts/main.js', 'app.js')
    )
})

gulp.task('styles', function(){
    var files = SRC_ROOT + '/styles/**.scss'
    return gulp.src(files)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 2 versions']}))
        .pipe(cleanCSS())
        .pipe(gulp.dest(PROD_ROOT + '/styles'))
})

gulp.task('default', ['static', 'scripts_vendor', 'scripts', 'styles'])


//***************** Debug *****************

gulp.task('debug_static', function(){
    var files = SRC_ROOT + '/static/**/*'
    function copy(){
        gutil.log('Coping static resources...')
        return gulp.src(files)
            .pipe(gulp.dest(DEBUG_ROOT))
            .on('end', function(){
                gutil.log('Coping static resources... Done!')
            })

    }
    copy()
    return gulp.watch(files, copy)
})


gulp.task('debug_scripts_vendor',  function(){

    var bundler = browserify("", {
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true,
        extensions: [".js", ".jsx"],
        require: Object.keys(packageJson.dependencies)
    })

    bundler = bundler.transform(babelify, {
        global: true,
        presets: [babelPresetEs2015]
    })
    bundler = watchify(bundler)

    function onError(err) {
        anybar('red')
        gutil.log(gutil.colors.red(err.message))
        var notifier = require('node-notifier')
        notifier.notify({
          'title': 'ERROR',
          'message': err.message
        })
    }

    function rebundle() {
        anybar('yellow')
        var bundle = bundler.bundle()
            .on('error',  onError)
            .pipe(source('vendor.js'))
            .on('error', onError)
            .pipe(gulp.dest(DEBUG_ROOT + '/scripts'))
            .on('error', onError)
            .on('end', function(){
                anybar('green')
            })
        return bundle
    }

    bundler.on('update', function() {
        var start = Date.now()
        gutil.log('Rebundling vendor...')
        var bundle = rebundle()
        bundle.on('end', function(){
            gutil.log("Rebundling vendor... Done! Time: " + (Date.now() - start))
        })
    })

    return rebundle()
})


gulp.task('debug_scripts', function(){
    function makeBundle(entryPoint, outputFile) {
        var bundler = browserify(entryPoint, {
            debug: true,
            cache: {},
            packageCache: {},
            fullPaths: true,
            extensions: [".js", ".jsx"]
        })

        // Register all dependencies as external (they are loaded via vendor bundle)
        Object.keys(packageJson.dependencies).forEach(function(dep){
            bundler.external(dep)
        })

        bundler = bundler.transform(babelify, {
            presets: [babelPresetEs2015]
        })
        bundler = watchify(bundler)

        function onError(err) {
            anybar('red')
            gutil.log(gutil.colors.red(err.message))
            var notifier = require('node-notifier')
            notifier.notify({
                'title': 'ERROR',
                'message': err.message
            })
        }

        function rebundle() {
            anybar('yellow')
            var bundle = bundler.bundle()
                .on('error',  onError)
                .pipe(source(outputFile))
                .on('error', onError)
                .pipe(gulp.dest(DEBUG_ROOT + '/scripts'))
                .on('error', onError)
                .on('end', function(){
                    anybar('green')
                })
            return bundle
        }

        bundler.on('update', function() {
            var start = Date.now()
            gutil.log('Rebundling "' + outputFile + '"...')
            var bundle = rebundle()
            bundle.on('end', function(){
                gutil.log('Rebundling "' + outputFile + '"... Done! Time: ' + (Date.now() - start))
            })
        })

        return rebundle()
    }

    return merge(
        makeBundle(SRC_ROOT + '/scripts/main.js', 'app.js')
    )
})

gulp.task('debug_styles',  function(){
    var files = SRC_ROOT + '/styles/**.scss'
    function build(){
        gutil.log("Rebuilding styles...")
        return gulp.src(files)
            .pipe(
                sass()
                    .on('error', sass.logError)
                    .on('end',function(){
                        gutil.log("Rebuilding styles... Done!")
                    }))
            .pipe(gulp.dest(DEBUG_ROOT + '/styles'))
    }
    build()
    return gulp.watch(files, build)
})

gulp.task('debug_serve', serve({
    root:DEBUG_ROOT,
    hostname: DEBUG_HOSTNAME,
    port:DEBUG_PORT,
}))

gulp.task('debug', ['debug_static', 'debug_styles', 'debug_scripts_vendor', 'debug_scripts', 'debug_serve']);
