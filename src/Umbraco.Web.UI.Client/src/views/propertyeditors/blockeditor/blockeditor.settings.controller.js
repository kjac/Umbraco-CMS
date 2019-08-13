angular.module("umbraco")
    .controller("Umbraco.PropertyEditors.BlockEditor.SettingsController", [
        "$scope",
        "contentTypeResource",
        "editorService",
        function ($scope, contentTypeResource, editorService) {

            $scope.elementTypes = [];

            if (!$scope.model.value) {
                $scope.model.value = [];
            }

            contentTypeResource.getAll()
                .then(function (contentType) {
                    $scope.elementTypes.push(contentType);
                });

            $scope.getBlockName = function(udi) {
                return 'Get block name from somewhere...';
            }
            
            $scope.addBlock = function () {

                var block = {};

                var pickerOptions = {
                    title: "Pick an element type",
                    view: "views/common/infiniteeditors/treepicker/treepicker.html",
                    size: "small",
                    multiPicker: false,
                    section: "settings",
                    treeAlias: "documentTypes",
                    entityType: "documentType",
                    submit: function (model) {
                        _.each(model.selection, function (elementType) {
                            block.elementType = elementType.udi;
                            block.settings = {}
                            $scope.model.value.push(block);
                        });

                        editorService.close();
                    },
                    close: function () {
                        editorService.close();
                    }
                };

                editorService.open(pickerOptions);
            }

            $scope.removeBlock = function (index) {
                $scope.model.value.splice(index, 1);
            };

            $scope.editSettings = function (block) {

                var pickerOptions = {
                    title: "Block settings",
                    view: "views/propertyeditors/blockeditor/block.settings.html",
                    size: "small",                    
                    submit: function (model) {
                        block.settings = model;
                        editorService.close();
                    },
                    close: function () {
                        editorService.close();
                    }
                };

                editorService.open(pickerOptions);
            }
        }
    ]);
