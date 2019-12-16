import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Register extends Component {
	constructor(props) {
		super(props);

		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			email: "",
			password: ""
		}
	}

	onChangeEmail(e) {
		this.setState({
			email: e.target.value
		})
	}

	onChangePassword(e) {
		this.setState({
			password: e.target.value
		})
	}

	onSubmit(e) {
		e.preventDefault();

		const user = {
			email: this.state.email,
			password: this.state.password
		}

		console.log(user);

		axios.post('http://localhost:8501/register', user)
			.then(res => console.log(res))
			.catch(err => console.error(err));

		this.setState({
			email: '',
			password: ''
		})
	}

	render() {
		return (
			<div className="row">
				<div className="col-12 text-center">
					<form onSubmit={this.onSubmit}>
						<div className="form-group">
							<label>Nomber de usuario: </label>
							<input type="email"
								required
								className="form-control"
								value={this.state.email}
								onChange={this.onChangeEmail}
							/>
						</div>
						<div className="form-group">
							<label>Contraseña: </label>
							<input type="password"
								required
								className="form-control"
								value={this.state.password}
								onChange={this.onChangePassword}
							/>
						</div>
						<input type="submit" value="Registrarse" className="btn btn-primary" />
						<br />
						<Link to="/register" className="nav-link">ya tengo una cuenta</Link>
					</form>
				</div>
			</div>
		)
	}
}