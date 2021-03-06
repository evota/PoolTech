import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import { Meteor } from 'meteor/meteor';
import { ShoppingList } from '../../api/shoppingList.js';
import { SwimmingPools} from '../../api/swimmingPool.js';
import template from './shoppingList.html';
import uiRouter from 'angular-ui-router';
import $mdToast from 'angular-material';


class ShoppingListController{
	constructor($scope, $stateParams, $state, $filter, $mdToast) {
		'ngInject';
		$scope.viewModel(this);
		this.$state = $state;
		this.$filter = $filter;
		this.subscribe('shoppingList');
		this.subscribe('swimmingPools');
		this.item = {};
		this.showNew = false;
		this.helpers({
			shoppingList(){
					return ShoppingList.find({"owner": Meteor.userId()},{sort: {
						datePurchased: -1
					}});
			},
			swimmingPools() {
				return SwimmingPools.find({"owner": Meteor.userId()});
			}
		})
	}
	toggleNew(){
		if (this.showNew){
			this.showNew = false;
		}else{
			this.showNew = true;
		}
	}
	modifyItem(item){
		//$mdToast.showSimple("Item Saved");
		if (item._id){
			Meteor.call("shoppingList.update", item);
		} else {
			Meteor.call("shoppingList.insert", item);
		}
		
		this.$state.go('shoppingList');
	}
	removeItem(itemId){
		Meteor.call("shoppingList.remove", itemId);
	}
	togglePurchased(item){
		this.modifyItem(item);
	}
	getPoolDetails(poolId) {
		return this.$filter('filter')(this.swimmingPools, {'_id': poolId});
	}
}

export default angular.module('shoppingList', [
	angularMeteor,
	uiRouter
])
	.component('shoppingList',{
		templateUrl: 'imports/components/shoppingList/shoppingList.html',
		controller: ['$scope', '$stateParams', '$state', '$filter', '$mdToast', ShoppingListController]
	});
