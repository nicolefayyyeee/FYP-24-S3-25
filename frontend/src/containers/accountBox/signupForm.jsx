import React, { useState, useContext } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import Modal from "../modal/Modal";
import useModal from "../hooks/useModal"; 

export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);
  
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { modalOpen, modalHeader, modalMessage, modalAction, openModal, closeModal } = useModal();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          name,
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        openModal("Success", data.message, () => {
          switchToSignin();
        });
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("There was an error with the signup. Please try again later.");
    }
  };

  return (
    <BoxContainer>
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={modalAction}
        header={modalHeader}
        message={modalMessage}
      />
      <FormContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Marginer direction="vertical" margin={20} />

        {errorMessage && <p style={{ color: 'red', textAlign: 'center' }} className="error-msg">{errorMessage}</p>}

        <SubmitButton type="submit" onClick={handleSubmit}>Signup</SubmitButton>
        </FormContainer>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#">
        Already have an account? 
        <BoldLink href="#" onClick={switchToSignin}>Sign in</BoldLink>
      </MutedLink>
      <Marginer direction="vertical" margin={50} />
    </BoxContainer>
  );
}
