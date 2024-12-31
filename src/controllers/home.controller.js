const home_view = (req, res) => {
	res.render("app/template", { template: "home" });
}

export { home_view }