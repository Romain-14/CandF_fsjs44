const home_view = (req, res) => {
	res.render("template", { template: "home" });
}

export { home_view }