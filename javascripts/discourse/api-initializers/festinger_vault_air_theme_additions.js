import { apiInitializer } from "discourse/lib/api";
import discourseComputed from "discourse-common/utils/decorators";
import { dasherize } from "@ember/string";
import CategoryList from "discourse/models/category-list";

export default apiInitializer("0.11.1", api => {
  api.modifyClass('controller:discovery/categories', {
    pluginId: "festinger-vault-air-theme-additions",

    @discourseComputed("model.parentCategory")
    categoryPageStyle(parentCategory) {
      console.log('idhar')
      let style = this.site.mobileView
        ? "categories_and_latest_topics"
        : this.siteSettings.desktop_category_page_style;

      if (parentCategory) {
        style =
          subcategoryStyleComponentNames[
            parentCategory.get("subcategory_list_style")
          ] || style;
      }

      const componentName =
        parentCategory && style === "categories_and_latest_topics"
          ? "categories_only"
          : style;
      return dasherize(componentName);
    },
  });

  api.modifyClass('route:discovery-categories', {
    pluginId: "festinger-vault-air-theme-additions",
    findCategories() {
      let style =
      !this.site.mobileView && this.siteSettings.desktop_category_page_style;

      if (this.site.mobileView) {
        style = "categories_and_latest_topics";
      }

      if (style === "categories_and_latest_topics") {
        return this._findCategoriesAndTopics("latest");
      } else if (style === "categories_and_top_topics") {
        return this._findCategoriesAndTopics("top");
      }

      return CategoryList.list(this.store);
    }
  });

  const currentUser = api.getCurrentUser();

  api.decorateWidget("header-buttons:before", (helper) => {
    if (currentUser) {
      return;
    }

    return helper.attach("button", {
      label: "sign_up",
      className: "btn-primary btn-small sign-up-button",
      action: "signUp",
    });
  });

  api.attachWidgetAction('header-buttons', 'signUp', () => {
    window.location = "https://festingervault.com/register/";
  });
});
