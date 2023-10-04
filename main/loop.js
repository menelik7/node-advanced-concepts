// node myFile.js

const pendingTimers = [];
const pendingOsTasks = [];
const pendingOperations = [];

// New timers, tasks, operations are recorded from myFile.js running
myfile.runContents();

function shouldContinue() {
	// Check one: Any pending setTimeout, setInterval, setImmediate?
	// Check two: Any pending OS tasks? (like servier listening to port)
	// Check three: Any pending long running operations? (like fs module)
	return (
		pendingTimers.length || pendingOsTasks.length || pendingOperations.length
	);
}

//  Entire body executed in one 'tick'
while (shouldContinue()) {
	// 1) Node looks at pending timers and sees if any functions are
	// ready to be called.  setTimeout, setInterval
	// 2) Node looks at pending OS tasks and pending operations and
	// calls relevant callbacks.
	// 3) Node pauses execution...Continue whenever:
	//   - a new pendingOSTask is done
	//   - a new pendinOperation is done
	//   - a timer is about to complete
	// 4) Look at pendingTimers.  Call any setImmediate.
	// 5) Handle any 'close' event
}

// exit back to terminal
