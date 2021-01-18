import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
/* 
    REFAKTOR (1) -> FRONTEND React modules
*/
class Form extends Component {
    constructor(props, default_state) {
        super(props)
        default_state = props.default ? { ...default_state, ...props.default } : default_state;
        this.state = {
            default: default_state,
            values: default_state,
            isNew: props.isNew || false,
            isOpen: props.isNew || false,
            loading: false,
        };
        this.onSave = props.onSave;
        this.onClose = props.onClose;
    }

    save = async () => { this.onSave({}) }
    save = async () => {
        this.setState({ isOpen: false })
        this.onClose({})
    }

    getValue = (name) => this.state.values[name];
    getSetter = (name) => {
        return ({ currentTarget }) => {
            let values = this.state.values;
            values[name] = currentTarget.value
            this.setState({ values })
        }
    }
    get = (name) => {
        return {
            val: this.getValue(name),
            set: (s) => {
                let new_val = {}
                new_val[name] = s
                this.setState(new_val)
            }
        }
    }


    toggleModal = () => { console.log(this.state); this.setState({ isOpen: !this.state.isOpen }) }

    render() {
        return (<>
            {this.detail()}
            <Modal onClosed={this.onClose} isOpen={this.state.isOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>
                    {this.header()}
                </ModalHeader>
                <ModalBody>
                    {this.body()}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" className="px-3 mx-2" disabled={this.state.loading}> Delete </Button>
                    <Button color="success" className="px-4 mx-2" onClick={this.save} disabled={this.state.loading}> Save </Button>
                    <Button color="secondary" onClick={this.toggleModal} disabled={this.state.loading}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>);
    }
}

export default Form;