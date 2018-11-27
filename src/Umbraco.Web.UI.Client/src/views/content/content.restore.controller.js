angular.module("umbraco").controller("Umbraco.Editors.Content.RestoreController",
    function ($scope, relationResource, contentResource, navigationService, appState, treeService, localizationService) {
		var dialogOptions = $scope.dialogOptions;

		var node = dialogOptions.currentNode;

        $scope.loading = true;
        $scope.error = null;
		$scope.info = null;
        $scope.success = false;
        $scope.moveAction = null;

		relationResource.getByChildId(node.id, "relateParentDocumentOnDelete").then(function (data) {
		    $scope.loading = false;

            if (data.length == 0) {
                $scope.info = {
                    errorMsg: localizationService.localize('recycleBin_itemCannotBeRestored'),
                    data: {
                        Message: localizationService.localize('recycleBin_noRestoreRelation')
                    }
                }
                return;
            }

		    $scope.relation = data[0];

			if ($scope.relation.parentId == -1) {
				$scope.target = { id: -1, name: "Root" };

			} else {
			    $scope.loading = true;
			    contentResource.getById($scope.relation.parentId).then(function (data) {
			        $scope.loading = false;
					$scope.target = data;

					// make sure the target item isn't in the recycle bin
					if($scope.target.path.indexOf("-20") !== -1) {
						$scope.info = {
                            errorMsg: localizationService.localize('recycleBin_itemCannotBeRestored'),
							data: {
                                Message: localizationService.localize('recycleBin_restoreUnderRecycled').then(function (value) {
                                    value.replace('%0%', $scope.target.name);
                                })
							}
						};
						$scope.success = false;
					}

				}, function (err) {
			        $scope.loading = false;
					$scope.error = err;
				});
			}

		}, function (err) {
		    $scope.loading = false;
			$scope.error = err;
		});

        treeService.getMenu({ treeNode: dialogOptions.currentNode })
            .then(function (data) {
                $scope.moveAction = _.find(data.menuItems, function (m) { return m.alias === "move"; });
            });

        $scope.restore = function () {
            $scope.loading = true;
			// this code was copied from `content.move.controller.js`
			contentResource.move({ parentId: $scope.target.id, id: node.id })
				.then(function (path) {
			        $scope.loading = false;

					$scope.success = true;

					//first we need to remove the node that launched the dialog
					treeService.removeNode($scope.currentNode);

					//get the currently edited node (if any)
					var activeNode = appState.getTreeState("selectedNode");

					//we need to do a double sync here: first sync to the moved content - but don't activate the node,
					//then sync to the currenlty edited content (note: this might not be the content that was moved!!)

					navigationService.syncTree({ tree: "content", path: path, forceReload: true, activate: false }).then(function (args) {
						if (activeNode) {
							var activeNodePath = treeService.getPath(activeNode).join();
							//sync to this node now - depending on what was copied this might already be synced but might not be
							navigationService.syncTree({ tree: "content", path: activeNodePath, forceReload: false, activate: true });
						}
					});

				}, function (err) {
			        $scope.loading = false;
					$scope.error = err;
				});
        };

        $scope.move = function() {
            if (!$scope.moveAction) {
                return;
            }
            navigationService.executeMenuAction($scope.moveAction, dialogOptions.currentNode, "content");
        }
	});
