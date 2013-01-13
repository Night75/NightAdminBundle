<?php

namespace Night\AdminBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;

class BaseAdmin extends Admin {

	protected $container;
	protected $subClasses = array();
	protected $path_images;
	// setup the default sort column and order
	protected $datagridValues = array(
	'_sort_order' => 'DESC',
	'_sort_by' => 'updated_at'
	);


	public function preConfigureForm() {
		$this->getCustomManager()->loadPreviousEntity($this->subject);
	}

	public function setContainer($container) {
		$this->container = $container;
	}

	public function getCustomManager() {
		$managerName = $this->container->get("entity_util")->getManagerFromEntity($this->getClass());
		//var_dump($managerName); exit;
		return $this->container->get($managerName);
	}

	public function getFormTheme() {
		return array("NightAdminBundle:Form:fields.html.twig");
	}

	public function prePersist($object) {
		$this->getCustomManager()->prePersist($object);
	}

	public function preUpdate($object) {

		$this->getCustomManager()->preUpdate($object);
	}

	public function postRemove($object) {
		$this->getCustomManager()->postRemove($object);
	}

	public function getPathImages() {
		return "/vengeful-spirits/" .$this->getCustomManager()->getUploadDir(). "/";
	}

	public function setPathImages($path_images) {
		$this->path_images = $path_images;
	}

}