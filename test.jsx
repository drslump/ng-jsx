// var [foo, bar] = [10, 20];
// <elem ng-bind={bar}>{foo}</elem>
// var bar = 	<foo id={item.id} ng-repeat="friend in friends track by friend.id">
// 				<span>{variable | 'foo'}</span>
// 			</foo>

var escaped = <p>curly {'{'} {`br ${c} ace`}</p>
var interp = <p>{`1234 | number:2`}</p>

// var template = <div class="vm-player" ng-show="enabled">
//               <div class="vm-player-button"
//                    ng-class={{loading: loading, loaded: loaded, paused: paused}}
//                    ng-click={playpause()}>
//                 <span class="spinner"></span>
//               </div>
//               <div class="vm-player-progress"
//                    ng-class={{playing: playing, failed: failed}}
//                    ng-show={!failed}>
//                 <div class="vm-player-progress-title" ng-transclude>
//                    title
//                 </div>
//                 <span class="vm-player-progress-bar">
//                   <span ng-style="{width: percent}"></span>
//                 </span>
//                 <span class="vm-player-progress-clock">{position | foo}</span>
//               </div>
//               <div ng-show="failed" class="vm-player-failed">
//                   <span translate>Loading failed</span>
//               </div>
//             </div>