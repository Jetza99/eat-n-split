import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);

  const [friendSelected, setFriendSelected] = useState(null);

  function handleFriendSelection(friend) {
    setFriendSelected((cur) => (cur?.id === friend.id ? null : friend));
    setIsOpen(false);
  }

  function handleAddFriends(friend) {
    setFriends((friends) => [...friends, friend]);
    handleIsOpen();
  }

  function handleIsOpen() {
    setIsOpen((isOpen) => (isOpen = !isOpen));
  }

  function handleSplitBill(newBalance) {
    setFriends((friends) =>
      friends.map((friend) =>
        friendSelected.id === friend.id
          ? { ...friend, balance: friend.balance + newBalance }
          : friend
      )
    );
    setFriendSelected(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          friendSelected={friendSelected}
          onSetFriendSelected={handleFriendSelection}
        />
        {isOpen && <FormAddFriend onAddFriends={handleAddFriends} />}
        <Button onClick={handleIsOpen}>
          {isOpen ? "Close" : "Add friend"}
        </Button>
      </div>
      {friendSelected && (
        <FormSplitBill
          friends={friends}
          friendSelected={friendSelected}
          onHandleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, friendSelected, onSetFriendSelected }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          friendSelected={friendSelected}
          onSetFriendSelected={onSetFriendSelected}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, friendSelected, onSetFriendSelected }) {
  const thisIsSelected = friendSelected?.id === friend.id;
  return (
    <li className={thisIsSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You're even with {friend.name}</p>}
      <Button onClick={() => onSetFriendSelected(friend)}>
        {thisIsSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID;
    const newFriend = { name, image: `${image}?=${id}`, balance: 0, id: id };
    onAddFriends(newFriend);
    console.log(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => handleSubmit(e)}>
      <label>🧑‍🤝‍🧑 Friend's name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName((name) => (name = e.target.value))}
      />

      <label>📸 Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage((image) => (image = e.target.value))}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friendSelected, onHandleSplitBill }) {
  const [bill, setBill] = useState("");
  const [expenses, setExpenses] = useState("");
  const friendExpenses = bill ? bill - expenses : "";

  const [whosPaying, setWhosPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !expenses) {
      return;
    }
    onHandleSplitBill(whosPaying === "user" ? friendExpenses : expenses * -1);
  }

  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
      <h2>Split a bill with {friendSelected.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        placeholder="Bill"
        value={bill}
        onChange={(e) => setBill((bill) => (bill = Number(e.target.value)))}
      />

      <label>👨 Your expenses</label>
      <input
        type="text"
        placeholder="Your expenses"
        value={expenses}
        onChange={(e) =>
          setExpenses((expenses) =>
            bill > Number(e.target.value)
              ? (expenses = Number(e.target.value))
              : bill
          )
        }
      />

      <label>🧑‍🤝‍🧑 {friendSelected.name}'s expenses</label>
      <input type="text" disabled value={friendExpenses} />

      <label>💵 Who's paying the bill</label>
      <select
        onChange={(e) =>
          setWhosPaying((whosPaying) => (whosPaying = e.target.value))
        }
      >
        <option value={whosPaying}>You</option>
        <option value="friend">{friendSelected.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
