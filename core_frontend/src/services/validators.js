
class BaseValidator{
    constructor() {
        this.errors = []
    }
    show_errors(){
        return this.errors
    }
}

export class SignUpValidator extends BaseValidator{
    constructor(email, password, password2) {
        super();
        this.email = email
        this.password = password
        this.password2 = password2
    }

    is_valid() {
        if (!this.email || !this.password || !this.password2) {
            this.errors.push({message: 'All fields are required'})
        }
        if (this.password !== this.password2) {
            this.errors.push({password2: 'Passwords do not match'})
        }
        if (this.password.length < 8){
            this.errors.push({password: 'Password must be at least 8 characters'})
        }
        return this.errors.length === 0;

    }
}

export class LoginValidator extends BaseValidator {
    constructor(email, password) {
        super();
        this.email = email
        this.password = password
    }

    is_valid() {
        if (!this.email || !this.password) {
            this.errors.push({message: 'All fields are required'})
        }
        return this.errors.length === 0;
    }
}

export class CreateBlogValidator extends BaseValidator {
    constructor(title, body) {
        super();
        this.title = title
        this.body = body
    }

    is_valid() {
        if (!this.title || !this.body) {
            this.errors.push({message: 'All fields are required'})
        }
        return this.errors.length === 0;
    }
}

export class EditBlogValidator extends BaseValidator{
    constructor(title, body, is_draft) {
        super();
        this.title = title
        this.body = body
        this.is_draft = is_draft
    }
    is_valid(){
        if (!this.title || !this.body) {
            this.errors.push({message: 'All fields are required'})
        }

        return this.errors.length === 0
    }

}

export class CommentValidator extends BaseValidator{
    constructor(comment) {
        super();
        this.comment = comment
    }
    is_valid(){
        if (this.comment.length < 10) {
            this.errors.push({comment: 'Your text must be at least 10 characters.'})
        }
        return this.errors.length === 0
    }
}