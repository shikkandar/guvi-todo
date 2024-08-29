import { ArrowDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { format } from "date-fns";

const App = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // State variables
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");

  const [hide, setHide] = useState(false);
  const [description, setDescription] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  console.log(todos);

  const [statusFilter, setStatusFilter] = useState("all");
  const [filterTerm, setFilterTerm] = useState("");
  const [hideStatus, setHideStatus] = useState({});

  const toggleHide = (id) => {
    setHideStatus((prevStatus) => ({
      ...prevStatus,
      [id]: !prevStatus[id],
    }));
  };

  // Load todos from localStorage on component mount
  useEffect(() => {
    const storedTodo = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(storedTodo);
  }, []);

  const reset = () => {
    setEditTodo(null);
    setName("");
    setDescription("");
  };
  // Add new todo
  const addTodo = () => {
    if (name && description) {
      const currentDate = new Date();
      const formattedDateTime = format(currentDate, "dd/MM/yyyy hh:mm:ss a");

      const newTodo = {
        id: new Date().getTime(),
        name: name,
        description: description,
        status: "notComplete",
        date: formattedDateTime, // Store the formatted date and time
      };

      setTodos((prevTodos) => [...prevTodos, newTodo]);
      localStorage.setItem("todos", JSON.stringify([...todos, newTodo]));
      setName("");
      setDescription("");
    }
  };

  // Delete todo
  const deleteBtn = (id) => {
    const updatedTodos = todos.filter((data) => data.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  // Edit todo
  const editBtn = (id) => {
    const editedTodo = todos.find((data) => data.id === id);
    setEditTodo(editedTodo);
    setName(editedTodo.name);
    setDescription(editedTodo.description);
  };

  // Update todo
  const updateTodo = () => {
    if (editTodo && name && description) {
      const currentDate = new Date();
      const formattedDateTime = format(currentDate, "dd/MM/yyyy hh:mm:ss a");
      const updatedTodos = todos.map((data) =>
        data.id === editTodo.id
          ? {
              ...data,
              name: name,
              description: description,
              status: "complete",
              date: formattedDateTime,
            }
          : data
      );

      setTodos(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      setEditTodo(null);
      setName("");
      setDescription("");
    }
  };

  // Handle status change
  const handleStatusChange = (id, selectedStatus) => {
    const updatedTodos = todos.map((data) =>
      data.id === id ? { ...data, status: selectedStatus } : data
    );
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Filter todos based on status and search term
  const filteredTodos = todos.filter((data) => {
    const matchesStatus =
      statusFilter === "all" || data.status === statusFilter;
    const matchesFilterTerm = data.name
      .toLowerCase()
      .includes(filterTerm.toLowerCase());

    return matchesStatus && matchesFilterTerm;
  });

  // JSX rendering
  return (
    <div>
      {/* Todo form */}
      <Container>
        <h1 className="h3 text-center mt-3">My todo</h1>
        <>
          <Modal
            show={show}
            onHide={handleClose}>
            <Modal.Header>
              <Modal.Title>
                {!editTodo ? "Add Task" : `Task Name (${name})`}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mt-3">
                <Form className="d-flex flex-column gap-2">
                  {/* Input fields for todo */}
                  {!editTodo && (
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  )}
                  <Form.Control
                    as="textarea"
                    placeholder="Notes"
                    value={description}
                    style={{ height: "100px" }}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {/* Add or update button based on editTodo */}
                </Form>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleClose}>
                Close
              </Button>
              {editTodo ? (
                <Button
                  variant="warning"
                  onClick={() => {
                    updateTodo();
                    handleClose();
                  }}>
                  Submit
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={() => {
                    addTodo();
                    handleClose();
                  }}>
                  Add
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        </>
      </Container>

      {/* Todo list and filter */}
      <div className="container d-flex justify-content-between mt-3">
        <h5 className="mt-4">My Todos</h5>
        <div>
          <label htmlFor="">Filter:</label>
          <select
            className="mt-4"
            value={statusFilter}
            onChange={handleStatusFilterChange}>
            {/* Filter options */}
            <option value="all">All</option>
            <option value="complete">Complete</option>
            <option value="notComplete">Not complete</option>
          </select>
        </div>
      </div>
      <div
        style={{ width: "100%" }}
        className="mt-5 container d-flex justify-content-center">
        <Button
          style={{ width: "90%", height: "50px" }}
          variant="success"
          onClick={() => {
            reset();
            handleShow();
          }}>
          Add Task
        </Button>
      </div>
      {/* Display todos */}
      <Container className="d-flex flex-wrap justify-content-center mt-4">
        {filteredTodos.map((data) => (
          <div
            key={data.id}
            style={{ width: "90%" }}>
            <div
              className="rounded thumnail p-3 m-1 d-flex flex-column"
              style={{
                backgroundColor:
                  data.status === "complete" ? "#FF964A" : "#D2D2D2",
              }}>
              <div className="d-flex justify-content-between">
                <p>{data.name}</p>

                {data.status !== "complete" ? (
                  <Button
                    className="mx-2"
                    variant="warning"
                    onClick={() => {
                      editBtn(data.id);
                      handleShow();
                    }}>
                    Edit
                  </Button>
                ) : (
                  <ArrowDown
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleHide(data.id)}
                  />
                )}
              </div>

              {hideStatus[data.id] && (
                <>
                  <p style={{ overflowWrap: "break-word", maxWidth: "100%" }}>
                    Date: {data.date}
                  </p>
                  <p style={{ overflowWrap: "break-word", maxWidth: "100%" }}>
                    Notes: {data.description}
                  </p>
                  <div className="align-self-end">
                    {data.status !== "complete" && (
                      <Button
                        className="mx-2"
                        variant="warning"
                        onClick={() => {
                          editBtn(data.id);
                          handleShow();
                        }}>
                        Edit
                      </Button>
                    )}
                    {/* <Button
                      variant="danger"
                      onClick={() => deleteBtn(data.id)}>
                      Del
                    </Button> */}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
};

export default App;
